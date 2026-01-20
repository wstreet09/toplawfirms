import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Inactive Profiles | Admin Dashboard",
  description: "Manage inactive law firm profiles awaiting activation",
}

export default async function InactiveProfilesPage() {
  // Fetch all inactive firms
  const inactiveFirms = await prisma.firm.findMany({
    where: {
      isActive: false,
    },
    include: {
      offices: {
        take: 1,
        include: {
          state: true,
        },
      },
      practiceAreas: {
        take: 3,
        include: {
          practiceArea: true,
        },
      },
    },
    orderBy: [
      { isPremium: 'desc' },
      { createdAt: 'desc' },
    ],
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Inactive Profiles</h1>
          <p className="text-muted-foreground mt-2">
            Law firms awaiting payment and profile activation
          </p>
        </div>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          {inactiveFirms.length} Inactive
        </Badge>
      </div>

      {inactiveFirms.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground text-lg">
              No inactive profiles found. All firms are active!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {inactiveFirms.map((firm) => (
            <Card key={firm.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-xl">{firm.name}</CardTitle>
                      {firm.isPremium && (
                        <Badge variant="default" className="bg-amber-500">
                          Premium
                        </Badge>
                      )}
                      <Badge variant="outline">Inactive</Badge>
                    </div>

                    {firm.offices[0] && (
                      <p className="text-sm text-muted-foreground mb-2">
                        📍 {firm.offices[0].city}{firm.offices[0].state ? `, ${firm.offices[0].state.name}` : ""}
                      </p>
                    )}

                    {firm.practiceAreas.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {firm.practiceAreas.map((fpa) => (
                          <Badge key={fpa.id} variant="secondary">
                            {fpa.practiceArea.name}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {firm.description && (
                      <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                        {firm.description}
                      </p>
                    )}

                    <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                      <span>Created: {new Date(firm.createdAt).toLocaleDateString()}</span>
                      {firm.website && (
                        <a
                          href={firm.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          View Website ↗
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <Link href={`/admin/firms/${firm.id}/edit`}>
                      <Button variant="outline" size="sm" className="w-full">
                        Edit Profile
                      </Button>
                    </Link>
                    <Link href={`/firms/${firm.slug}/overview`} target="_blank">
                      <Button variant="ghost" size="sm" className="w-full">
                        Preview
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg">About Inactive Profiles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <strong>Inactive profiles</strong> appear in directory listings but show an "Activate Profile" button instead of full profile access.
          </p>
          <p>
            These profiles are typically created from approved nominations and are awaiting:
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Payment confirmation</li>
            <li>Additional profile information from the firm</li>
            <li>Final verification before activation</li>
          </ul>
          <p className="mt-4">
            To activate a profile, edit it and toggle the "Profile Status" switch to Active.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
